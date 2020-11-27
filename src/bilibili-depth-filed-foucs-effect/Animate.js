import React, { useRef, useCallback, useState, useEffect } from 'react'
import './Animate.css'

/*
*   props.images 为需要渲染的图片数组
*   props.blurBase  为模糊效果的基数, 默认值为 5
*   props.offsetBase    为自动偏移量的基础, 默认值为 20
*   props.resetDuration 为自动回弹的动画时间, 默认值为 400
*/

export default function Animate(props) {
    /*
    * 运动的数据
    * lastPosition 上次运动鼠标的位置, 用百分比表示
    * progress 景深和偏移效果的进度
    */
    const [movementDetail, setMovementDetail] = useState({ lastPosition: 0, progress: 0 })
    const intervalIDRef = useRef(null)
    const divRef = useRef()

    const movementControl = useCallback((progress, blurBase, offsetBase, target) => {
        blurBase = blurBase || 5
        offsetBase = offsetBase || 20
        const images = target.querySelectorAll ? target.querySelectorAll('img') : []
        let offset = offsetBase * progress

        images.forEach((image, index) => {
            offset *= 1.3
            /*
            *    由于 progress 取值范围为 [-1, 1], 所以需要 indexY 函数将 index 转化成 [-1, 1] 之间数值
            *        当 index = 0 时, indexY = -1
            *        当 index = images.length -1 时, indexY = 1
            *    所以,
            *        当 progress = 1 时, index = 0 图片的 blurValue = 0, 
            *        其他图片的 blurValue 随着与 index = 0 的距离依次递增
            *        当 progress = -1 时, index = images.length -1 图片的 blurValue = 0, 同理
            */
            const indexY = 2 / (images.length - 1) * index - 1
            let blurValue = Math.pow((indexY - progress), 2) * blurBase

            image.style.setProperty('--offset', `${offset}px`)
            image.style.setProperty('--blur', `${blurValue}px`)
        })
    }, [])

    const calcCurrentPosition = useCallback((event) => {
        return event.clientX / event.currentTarget.offsetWidth
    }, [])

    const calcProgress = useCallback((currentPosition, movementDetail) => {
        // 通过两次鼠标移动的位置差来控制效果变化
        const percentage = currentPosition - movementDetail.lastPosition
        const progress = movementDetail.progress + percentage
        return progress
    }, [])

    const playReset = (start, end, duration, target) => {
        duration = duration || 400
        const FRAME_INTERVAL = 40
        const FRAME_QTY = duration / FRAME_INTERVAL
        let frameCount = 0
        let intervalID = null
        const run = () => {
            if (frameCount >= FRAME_QTY) {
                clearInterval(intervalID)
            } else {
                // 用 log 函数来模拟 ease-out 的效果
                // 好像应该用其他函数才对
                const step = (end - start) * (Math.log(++frameCount) / Math.log(FRAME_QTY))
                const progress = start + step
                movementControl(progress, props.blurBase, props.offsetBase, target)

                //更新progress状态
                setMovementDetail({ ...movementDetail, progress })
            }
        }

        intervalID = setInterval(run, FRAME_INTERVAL)
        return intervalID
    }

    const mousemoveHandle = (event) => {
        const currentPosition = calcCurrentPosition(event)
        const progress = calcProgress(currentPosition, movementDetail)
        movementControl(progress, props.blurBase, props.offsetBase, event.currentTarget)

        //更新状态
        setMovementDetail({ lastPosition: currentPosition, progress })
    }

    const mouseenterHandle = (event) => {
        clearInterval(intervalIDRef.current)
        const currentPosition = calcCurrentPosition(event)

        //更新状态
        setMovementDetail({ ...movementDetail, lastPosition: currentPosition })
    }

    const mouseleaveHandle = (event) => {
        intervalIDRef.current = playReset(movementDetail.progress, 0, props.resetDuration, event.currentTarget)
    }

    useEffect(() => {
        movementControl(0, props.blurBase, props.offsetBase, divRef.current)
    }, [movementControl, props.blurBase, props.offsetBase])

    return (
        <div
            ref={divRef}
            className="animate-wraper"
            style={props.style}
            onMouseEnter={mouseenterHandle}
            onMouseMove={mousemoveHandle}
            onMouseLeave={mouseleaveHandle}
        >
            {props.images.map((image, index) => {
                return (
                    <div key={index} className="animate__img-container">
                        <img className="animate__img" src={image.src || ""} alt={image.alt || ""} />
                    </div>
                )
            })}
        </div>
    )
}