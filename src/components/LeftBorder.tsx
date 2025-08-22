const LeftBorder = () => {
  return (
    <div 
      className="fixed left-0 top-0 h-screen z-40 pointer-events-none"
      style={{
        width: 'clamp(60px, 8vw, 120px)',
        backgroundImage: 'url(/lovable-uploads/ef68daa5-679e-4283-96bd-574f41af0418.png)',
        backgroundRepeat: 'repeat-y',
        backgroundSize: '100% auto',
        backgroundPosition: 'left center'
      }}
    />
  );
};

export default LeftBorder;