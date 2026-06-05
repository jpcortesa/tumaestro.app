async function getContratistas() {
  try {
    const res = await fetch('https://tumaestro-backend.onrender.com/api/contratistas/', {
      cache: 'no-store'
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export default async function Home() {
  const contratistas = await getContratistas()

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">tumaestro.app</h1>
      <h2 className="text-xl mb-4">Contratistas registrados</h2>
      {contratistas.length === 0 ? (
        <p className="text-gray-500">No hay contratistas registrados aún.</p>
      ) : (
        <ul>
          {contratistas.map((c) => (
            <li key={c.id} className="border p-4 mb-2 rounded">
              <strong>{c.nombre}</strong> — {c.oficio} — {c.telefono}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
