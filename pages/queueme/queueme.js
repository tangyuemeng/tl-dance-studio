// pages/queueme/queueme.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        count: 0,
        totalCount: 0,
        filePath: "",
        points: [],
        selectedPoints: [],
        savedQueue:[],
        currentTime: 0, // 当前播放时间
        formatCurrentTime: "0:00", // 当前播放时间
        duration: 0, // 音频总时长
        formatDuration: "0:00", // 音频总时长
        isSliderChanging: false // 用于标识是否正在拖动滑块
    },

    onLoad(options) {
        if (options.count && options.filePath) {
            this.setData({
                count: options.count,
                totalCount: options.count,
                filePath: options.filePath
            });
            this.triggerEvent('change', {
                count: this.data.count,
                totalCount: this.data.totalCount,
                filePath: this.data.filePath
            });
        }
        this.initAudioPlayer()
        this.generatePoints()
        this.data.selectedPoints = this.initSelectedPoints(options.count)
        console.log(this.data.totalCount)
    },

    initSelectedPoints(count) {
        const points = []
        for (let id = 1; id <= count; id++) {
            points.push({
                id,
                row: null,
                col: null
            })
        }
        return points
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
        });
    },

    playAudio() {
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
        const points = [];
        for (let row = 0; row < 11; row++) {
            for (let col = 0; col < 17; col++) {
                points.push({
                    row,
                    col,
                    id: "",
                    active: false
                });
            }
        }
        this.setData({
            points
        });
    },

    handlePointTap(event) {
        const {
            row,
            col
        } = event.currentTarget.dataset;
        const targetPoint = this.data.selectedPoints.find(point => point.row === row && point.col === col);
        if (targetPoint) {
            this.deletePoint(targetPoint)
        } else {
            this.addPoint(row, col)
        }
    },

    addPoint(row, col) {
        if (this.data.count == 0) {
            return
        }
        this.triggerEvent('change', {
            count: this.data.count - 1,
        });
        this.setData({
            count: this.data.count - 1
        })
        const nullPoints = this.data.selectedPoints.filter(point => point.row === null && point.col === null);
        // 找出 id 最小的项
        const targetPoint = nullPoints.reduce((minPoint, currentPoint) => {
            return (currentPoint.id < minPoint.id) ? currentPoint : minPoint;
        }, nullPoints[0]);
        targetPoint.row = row
        targetPoint.col = col
        this.renderSelected()
    },

    deletePoint(point) {
        if (this.data.count == this.data.totalCount) {
            return
        }
        this.triggerEvent('change', {
            count: this.data.count + 1,
        });
        this.setData({
            count: this.data.count + 1
        })
        this.renderDelete(point)

        const targetPoint = this.data.selectedPoints.find(ap => ap.id === point.id)
        targetPoint.row = null
        targetPoint.col = null
    },

    renderSelected() {
        const selectedPoints = this.data.selectedPoints;
        const points = this.data.points.map(point => ({
            ...point
        })); // 复制一份 allpoints

        selectedPoints.forEach(point => {
            const match = points.find(ap => ap.row === point.row && ap.col === point.col);
            if (match) {
                match.active = true;
                match.id = point.id
            }
        });
        this.setData({
            points
        });
    },

    renderDelete(targetPoint) {
        const points = this.data.points.map(point => ({
            ...point
        }));
        const match = points.find(ap => ap.row === targetPoint.row && ap.col === targetPoint.col);
        if (match) {
            match.active = false;
            match.id = ""
        }
        this.setData({
            points
        });
    },

    addQueue(){
        var selected = this.data.selectedPoints.map(item => ({ ...item }));
        this.data.savedQueue.push({
            time: this.data.currentTime,
            selected: selected
        })
    }
})