
export function ThreeViewer() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <iframe 
        src='https://my.spline.design/sparqlogo3dscenefinal-68a89f0d7807b5e586b07aed3b895cbb/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        title="Sparq 3D Logo Scene"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </div>
  );
}
