function Paragraph({ children }: { children: React.ReactNode }) {
    return (
        <p className="dark:text-slate-200">{children}</p>
    )
}

export default Paragraph