const ShowTime = ({ timeLeft }: { timeLeft: number }) => {
    return (
        <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100 mb-4 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                {timeLeft}s
            </span>
        </div>
    )
}

export default ShowTime;