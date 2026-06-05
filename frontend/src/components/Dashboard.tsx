import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled';
  resource: Resource;
}

export const Dashboard: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [resResources, resBookings] = await Promise.all([
        fetch('/api/resources', { headers }),
        fetch('/api/bookings/my-bookings', { headers })
      ]);
      const dataResources = await resResources.json();
      const dataBookings = await resBookings.json();
      
      if (Array.isArray(dataResources)) setResources(dataResources);
      if (Array.isArray(dataBookings)) setBookings(dataBookings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resourceId: selectedResource, startTime, endTime }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la réservation');
      setMessage({ text: 'Réservation validée avec succès !', type: 'success' });
      fetchData();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md h-fit">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Réserver une ressource</h3>
        {message.text && (
          <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ressource</label>
            <select required value={selectedResource} onChange={e => setSelectedResource(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
              <option value="">Sélectionner...</option>
              {resources.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Début</label>
            <input type="datetime-local" required value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fin</label>
            <input type="datetime-local" required value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm font-medium text-sm">
            Confirmer la réservation
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Ressources disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map(r => (
              <div key={r.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg text-gray-900">{r.name}</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">{r.type}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{r.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Mon historique de réservations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ressource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Début</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{b.resource?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(b.startTime).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(b.endTime).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {b.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      {b.status === 'confirmed' && (
                        <button onClick={() => cancelBooking(b.id)} className="text-red-600 hover:text-red-900">Annuler</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
