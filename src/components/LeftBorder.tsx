const LeftBorder = () => {
  return (
    <div 
      className="fixed left-0 top-0 h-screen z-40 pointer-events-none"
      style={{
        width: 'clamp(60px, 8vw, 120px)',
        backgroundImage: 'url(/lovable-uploads/5ebe04b6-9d04-468a-baab-5743df7b7e8e.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'left center'
      }}
    />
  );
};

export default LeftBorder;