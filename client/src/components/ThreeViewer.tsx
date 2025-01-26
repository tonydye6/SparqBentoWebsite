export function ThreeViewer() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <iframe 
        src='https://my.spline.design/untitled-61fd32762a48cfe586b07aed3b895cbb/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        title="Sparq 3D Scene"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}