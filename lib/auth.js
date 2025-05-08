export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return localStorage.getItem('token');
};

export const protectRoute = (context) => {
  const token = context.req ? context.req.cookies.token : localStorage.getItem('token');

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};