import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { ref, onValue, set } from 'firebase/database';
import { db } from './firebase';

const containerStyle = {
  width: '100%',
  height: '100vh',  // ocupa toda la pantalla
};

const defaultCenter = {
  lat: 19.4326,
  lng: -99.1332,
};

type Role = 'cliente' | 'repartidor' | null;

function App() {
  const [role, setRole] = useState<Role>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Para cliente, almacenamos la posición del repartidor
  const [repartidorPos, setRepartidorPos] = useState<{ lat: number; lng: number } | null>(null);

  // Cuando repartidor, sube ubicación en tiempo real
  useEffect(() => {
    if (role === 'repartidor') {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const coords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            setPosition(coords);
            // Guardar en Firebase (path "ubicacion/repartidor")
            set(ref(db, 'ubicacion/repartidor'), coords);
          },
          (error) => {
            console.error('Error al obtener ubicación:', error);
            alert('No se pudo obtener la ubicación.');
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
      } else {
        alert('Tu navegador no soporta geolocalización.');
      }
    }
  }, [role]);

  // Cuando cliente, escucha ubicación del repartidor
  useEffect(() => {
    if (role === 'cliente') {
      const ubicacionRef = ref(db, 'ubicacion/repartidor');
      const unsubscribe = onValue(ubicacionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setRepartidorPos(data);
      });
      return () => unsubscribe();
    }
  }, [role]);

  if (!role) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Selecciona tu rol</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => setRole('cliente')} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Cliente
          </button>
          <button onClick={() => setRole('repartidor')} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Repartidor
          </button>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyBm-0RbxDUhygQlvNwJSGxxbbwarll1q8o">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={role === 'repartidor' ? (position || defaultCenter) : (repartidorPos || defaultCenter)}
        zoom={15}
      >
        {/* Marcador del repartidor */}
        {(role === 'repartidor' && position) && <Marker position={position} label="Tú" />}
        {(role === 'cliente' && repartidorPos) && <Marker position={repartidorPos} label="Repartidor" />}
      </GoogleMap>
    </LoadScript>
  );
}

export default App;
