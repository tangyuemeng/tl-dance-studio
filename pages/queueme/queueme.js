// pages/queueme/queueme.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        totalCount: 0,
        col: 12,
        row: 8,
        squareSize: 32,
        pointSize: 16,
        filePath: "",
        points: [],
        savedQueue: [],
        currentTime: 0, // 当前播放时间
        formatCurrentTime: "0:00", // 当前播放时间
        duration: 0, // 音频总时长
        formatDuration: "0:00", // 音频总时长
        isSliderChanging: false, // 用于标识是否正在拖动滑块
        activeIndex: null,
        startX: 0,
        startY: 0,
        isShowDistance: true,
        isShowBackStage: true,
        isVerse: true,
    },

    onLoad(options) {
        if (options.count && options.filePath) {
            this.setData({
                totalCount: options.count,
                filePath: options.filePath
            });
            this.triggerEvent('change', {
                totalCount: this.data.totalCount,
                filePath: this.data.filePath
            });
        }
        this.initBaseView()
        this.initAudioPlayer()
        this.generatePoints()
        this.initDistance()
    },

    initBaseView() {
        this.setData({
            col: this.data.col,
            row: this.data.row,
            squareSize: this.data.squareSize,
            pointSize: this.data.pointSize
        })
    },

    initDistance() {
        const descending = Array.from({
            length: 6
        }, (_, i) => 5 - i);
        // 生成从 1 到 5 的数组
        const ascending = Array.from({
            length: 5
        }, (_, i) => i + 1);
        // 合并两个数组
        this.setData({
            distances: descending.concat(ascending)
        })
    },

    initAudioPlayer() {
        this.innerAudioContext = wx.createInnerAudioContext({
            useWebAudioImplement: false
        })
        this.innerAudioContext.src = this.data.filePath
        const loadDuration = () => {
            setTimeout(() => {
                if (!this.innerAudioContext.duration) {
                    loadDuration();
                } else {
                    this.setData({
                        duration: this.innerAudioContext.duration,
                        formatDuration: this.formatTime(this.innerAudioContext.duration)
                    });
                }
            }, 100);
        };
        this.innerAudioContext.onCanplay(loadDuration);
        this.innerAudioContext.onTimeUpdate(() => {
            if (!this.data.isSliderChanging) {
                this.setData({
                    currentTime: this.innerAudioContext.currentTime,
                    formatCurrentTime: this.formatTime(this.innerAudioContext.currentTime)
                });
            }

            this.data.savedQueue.forEach((queue, index) => {
                if (Math.abs(this.innerAudioContext.currentTime - queue.time) < 0.5) { // 考虑到时间可能不会精确匹配，允许一些误差
                    this.renderSelect(index)
                }
            });
        });
    },

    playAudio() {
        this.innerAudioContext.play();
    },

    replayAudio(){
        this.innerAudioContext.seek(0);
        this.setData({
            formatCurrentTime: this.formatTime(0),
            currentTime: 0,
        });
        this.innerAudioContext.play();
    },

    pauseAudio() {
        this.innerAudioContext.pause();
    },

    seekAudio(e) {
        const position = e.detail.value;
        this.innerAudioContext.seek(position);
        this.setData({
            formatCurrentTime: this.formatTime(position),
            currentTime: position,
            isSliderChanging: false
        });
    },

    onSliderChanging(e) {
        this.setData({
            formatCurrentTime: this.formatTime(e.detail.value),
            currentTime: e.detail.value,
            isSliderChanging: true
        });
    },

    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    },

    onUnload() {
        if (this.innerAudioContext) {
            this.innerAudioContext.destroy();
        }
    },

    generatePoints() {
        const count = this.data.totalCount
        for (let id = 0; id < count; id++) {
            if (id < 9) {
                this.data.points.push({
                    index: id,
                    x: this.data.squareSize * (2 + id % 9) - this.data.pointSize / 2,
                    y: this.data.squareSize - this.data.pointSize / 2,
                })
            } else if (id < 18) {
                this.data.points.push({
                    index: id,
                    x: this.data.squareSize * (2 + id % 9) - this.data.pointSize / 2,
                    y: this.data.squareSize * 2 - this.data.pointSize / 2,
                })
            } else if (id < 24) {
                this.data.points.push({
                    index: id,
                    x: this.data.squareSize * (2 + id % 9) - this.data.pointSize / 2,
                    y: this.data.squareSize * 3 - this.data.pointSize / 2,
                })
            }
        }
        const points = this.data.points
        this.setData({
            points
        })
    },


    addQueue() {
        const copiedPoints = this.data.points.map(point => ({
            ...point
        }));
        this.data.savedQueue.push({
            time: this.data.currentTime,
            queue: copiedPoints
        })
        this.setData({
            savedQueue: this.data.savedQueue
        })
    },

    onSelect(e) {
        const index = e.currentTarget.dataset.index
        this.renderSelect(index)
    },

    onLongPress(e){
        const index = e.currentTarget.dataset.index
        console.log(index)
    },

    renderSelect(index) {
        const time = this.data.savedQueue[index].time
        const points = this.data.savedQueue[index].queue
        this.data.currentTime = time
        this.setData({
            enableAnimation: true,
            onSelect: index,
            currentTime: time,
            formatCurrentTime: this.formatTime(time),
            points: points,
        })
    },

    touchStart: function (e) {
        const index = e.currentTarget.dataset.index;
        // 记录起始触摸点的坐标
        this.setData({
            enableAnimation: false,
            activeIndex: index,
            startX: e.touches[0].clientX,
            startY: e.touches[0].clientY
        });
    },

    touchMove: function (e) {
        const index = this.data.activeIndex;
        if (index === null) return;

        // 计算移动的距离
        const deltaX = e.touches[0].clientX - this.data.startX;
        const deltaY = e.touches[0].clientY - this.data.startY;

        // 计算新的坐标
        let newX = this.data.points[index].x + deltaX;
        let newY = this.data.points[index].y + deltaY;

        const maxX = this.data.squareSize * this.data.col - this.data.pointSize;
        const maxY = this.data.squareSize * this.data.row - this.data.pointSize;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        // 更新点的坐标
        const keyX = `points[${index}].x`;
        const keyY = `points[${index}].y`;
        this.setData({
            [keyX]: newX,
            [keyY]: newY,
            startX: e.touches[0].clientX,
            startY: e.touches[0].clientY
        });
    },

    touchEnd: function () {
        const index = this.data.activeIndex;
        if (index !== null) {
            // 吸附到最近的网格线上
            const gridSize = this.data.squareSize / 2;
            const maxX = this.data.col * this.data.squareSize - gridSize;
            const maxY = this.data.row * this.data.squareSize - gridSize;
            let point = this.data.points[index];

            let snappedX = Math.round(point.x / gridSize) * gridSize - this.data.pointSize / 2;
            let snappedY = Math.round(point.y / gridSize) * gridSize - this.data.pointSize / 2;

            // 限制吸附后的坐标在父视图内
            snappedX = Math.max(0, Math.min(snappedX, maxX));
            snappedY = Math.max(0, Math.min(snappedY, maxY));

            const keyX = `points[${index}].x`;
            const keyY = `points[${index}].y`;
            this.setData({
                [keyX]: snappedX,
                [keyY]: snappedY,
                activeIndex: null
            });
        }
    },

    change(e) {
        const item = e.currentTarget.dataset.item
        switch (item) {
            case "distance":
                this.data.isShowDistance = !this.data.isShowDistance
                this.setData({
                    isShowDistance: this.data.isShowDistance
                })
                break
            case "backstage":
                this.data.isShowBackStage = !this.data.isShowBackStage
                this.setData({
                    isShowBackStage: this.data.isShowBackStage
                })
                break
            case "verse":
                this.data.isVerse = !this.data.isVerse
                this.setData({
                    isVerse: this.data.isVerse
                })
                break
        }
    },
})