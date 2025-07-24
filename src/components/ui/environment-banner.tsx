
const VITE_APP_ENV = import.meta.env.VITE_APP_ENV || 'production';

export const EnvironmentBanner = () => {
  if (VITE_APP_ENV === 'production') {
    return null;
  }

  const envConfig = {
    development: {
      name: 'Development',
      className: 'bg-blue-500',
    },
    staging: {
      name: 'Staging',
      className: 'bg-yellow-500',
    },
  };

  const config = envConfig[VITE_APP_ENV as keyof typeof envConfig];

  if (!config) {
    return null;
  }

  return (
    <div className={`w-full text-center text-white p-1 ${config.className}`}>
      <p className="font-semibold">{config.name} Environment</p>
    </div>
  );
};
