import SignIn from './components/Auth/SignIn';
import { Provider } from 'react-redux';
import  store from './utils/redux/store';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}>
      <SignIn/>
      </RouterProvider>
    </Provider>
  );
}

export default App;
