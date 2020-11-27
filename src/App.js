import BilibiliDepthFieldFoucsEffect from './bilibili-depth-filed-foucs-effect/Animate'
import './App.css'

function App() {
  return (
    <>
      <BilibiliDepthFieldFoucsEffectExample />
      <h1>Bilibili 秋季的头部背景图</h1>
    </>
  );
}

function BilibiliDepthFieldFoucsEffectExample() {
  const images = [
    { src: "https://assets.codepen.io/2002878/bilibili-autumn-1.png", alt: "" },
    { src: "https://assets.codepen.io/2002878/bilibili-autumn-3.png", alt: "" },
    { src: "https://assets.codepen.io/2002878/bilibili-autumn-2.png", alt: "" },
    { src: "https://assets.codepen.io/2002878/bilibili-autumn-4.png", alt: "" },
    { src: "https://assets.codepen.io/2002878/bilibili-autumn-5.png", alt: "" },
    { src: "https://assets.codepen.io/2002878/bilibili-autumn-6.png", alt: "" },
  ]
  return (
    <BilibiliDepthFieldFoucsEffect
      style={{ height: 200 }}
      images={images}
      blurBase={5}
      offsetBase={25}
      resetDuration={300}
    >
    </BilibiliDepthFieldFoucsEffect >
  )
}

export default App;
