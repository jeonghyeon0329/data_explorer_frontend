function Spinner({ size = 'md', className = '' }) {
  const sz = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }[size] ?? 'h-6 w-6';
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-700 border-t-blue-500 ${sz} ${className}`} />
  );
}

export default Spinner;
