
export const getCategoryColor = (categoryName: string) => {
    if (!categoryName) return {
        subtle: 'bg-gray-100 text-gray-800 border-gray-200',
        solid: 'bg-gray-600 text-white'
    };

    const colors = [
        { subtle: 'bg-blue-100 text-blue-800 border-blue-200', solid: 'bg-blue-600 text-white' },
        { subtle: 'bg-green-100 text-green-800 border-green-200', solid: 'bg-green-600 text-white' },
        { subtle: 'bg-yellow-100 text-yellow-800 border-yellow-200', solid: 'bg-yellow-500 text-white' },
        { subtle: 'bg-red-100 text-red-800 border-red-200', solid: 'bg-red-600 text-white' },
        { subtle: 'bg-purple-100 text-purple-800 border-purple-200', solid: 'bg-purple-600 text-white' },
        { subtle: 'bg-pink-100 text-pink-800 border-pink-200', solid: 'bg-pink-600 text-white' },
        { subtle: 'bg-indigo-100 text-indigo-800 border-indigo-200', solid: 'bg-indigo-600 text-white' },
        { subtle: 'bg-teal-100 text-teal-800 border-teal-200', solid: 'bg-teal-600 text-white' },
        { subtle: 'bg-orange-100 text-orange-800 border-orange-200', solid: 'bg-orange-500 text-white' },
        { subtle: 'bg-cyan-100 text-cyan-800 border-cyan-200', solid: 'bg-cyan-600 text-white' },
    ];

    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
        hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
};
