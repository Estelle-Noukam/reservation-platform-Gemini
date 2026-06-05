import React, { useState, useEffect, useContext } from 'react';
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
  user: { name: string; email: string };
}

export const AdminPanel: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('room');
  const [description, setDescription] = useState('');

  const loadAdminData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [resResources, resBookings] = await Promise.all([
        fetch('/api/resources', { headers }),
        fetch('/api/bookings/all', { headers })
      ]);
      setResources(await resResources.json());
      setBookings(await resBookings.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [token]);

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, type, description }),
      });
      if (response.ok) {
        setName('');
        setDescription('');
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Ajouter une ressource</h3>
          <form onSubmit={handleCreateResource} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de la ressource</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                <option value="room">Salle</option>
                <option value="equipment">Équipement</option>
                <option value="service">Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows={3} />
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-sm font-medium text-sm">
              Ajouter
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Gestion des ressources</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map(r => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                    <td className="px-6 py-4 uppercase text-gray-600">{r.type}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteResource(r.id)} className="text-red-600 hover:text-red-900 font-medium">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Toutes les réservations de la plateforme</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Ressource</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Début</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{b.user?.name}</div>
                    <div className="text-gray-500 text-xs">{b.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{b.resource?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(b.startTime).toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(b.endTime).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {b.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {b.status === 'confirmed' && (
                      <button onClick={() => handleCancelBooking(b.id)} className="text-red-600 hover:text-red-900">Annuler d'office</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
