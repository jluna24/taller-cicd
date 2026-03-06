const ROLE_BADGE = {
  ORGANIZER: 'bg-orange-500/20 text-orange-500 dark:text-orange-400 border-orange-500/30',
  'CO-ORGANIZER': 'bg-purple-500/20 text-purple-500 dark:text-purple-400 border-purple-500/30',
  MEMBER: 'bg-slate-200/60 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 border-slate-300/60 dark:border-slate-600/30',
}

const MEDAL = ['🥇', '🥈', '🥉']

export default function TopContributors({ members }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#2a3547] bg-white dark:bg-[#1a2233] p-5">
      <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-4">Top contributors</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-[#2a3547]">
              <th className="text-left pb-3 pr-4 font-medium w-8">#</th>
              <th className="text-left pb-3 pr-4 font-medium">Nombre</th>
              <th className="text-left pb-3 pr-4 font-medium">Ciudad</th>
              <th className="text-center pb-3 pr-4 font-medium">Eventos</th>
              <th className="text-center pb-3 pr-4 font-medium">RSVPs Yes</th>
              <th className="text-left pb-3 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr
                key={m['Member ID']}
                className="border-b border-slate-100 dark:border-[#2a3547]/50 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
              >
                <td className="py-3 pr-4 text-slate-400 dark:text-slate-500 font-mono">
                  {MEDAL[i] ?? <span className="text-slate-400 dark:text-slate-600">{i + 1}</span>}
                </td>
                <td className="py-3 pr-4">
                  <a
                    href={m['URL of Member Profile']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 dark:text-white hover:text-[#FF9900] transition-colors font-medium"
                  >
                    {m.Name}
                  </a>
                </td>
                <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{m.Location || '—'}</td>
                <td className="py-3 pr-4 text-center">
                  <span className="font-bold text-[#FF9900]">{m['Events attended']}</span>
                </td>
                <td className="py-3 pr-4 text-center text-slate-600 dark:text-slate-300">
                  {m["All time 'Yes' RSVPs"]}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs border ${
                      ROLE_BADGE[m.Role] ?? ROLE_BADGE.MEMBER
                    }`}
                  >
                    {m.Role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
