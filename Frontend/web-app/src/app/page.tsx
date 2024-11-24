import dynamic from 'next/dynamic';
import './globals.css';

const MyComponent = dynamic(() => import('./add_post'), { 
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <div>
      <MyComponent />
    </div>
  );
}