import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { io } from 'socket.io-client';
import SocketProvider from './Components/SocketProvider/SocketProvider';
import LoginForm from './Pages/Login';
import ErrorPage from './errors/wrongRoute.js';
import Chat from './Pages/Chat/Chat.jsx';
import store from './slices/index.js';
import SignUp from './Pages/SignUp';
import ChatRoute from './Components/ChatRoute/ChatRoute';
import paths from './paths';
import { actions as messagesActions } from './slices/messagesSlice';
import { actions as channelsActions } from './slices/channelsSlice';
import { useAuth } from './hooks';
import './App.scss';

const App = () => {
  const socket = io();
  const {
    getUsername,
  } = useAuth();

  socket.on('newMessage', (payload) => {
    store.dispatch(messagesActions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    store.dispatch(channelsActions.addChannel(payload));
    if (payload.userName === getUsername()) {
      store.dispatch(channelsActions.changeCurrentChannel(payload.id));
    }
  });
  socket.on('removeChannel', ({ id }) => {
    const state = store.getState();
    store.dispatch(channelsActions.removeChannel(id));
    if (id === state.channels.currentChannel) {
      store.dispatch(channelsActions.changeCurrentChannel(1));
    }
  });
  socket.on('renameChannel', (payload) => {
    store.dispatch(channelsActions.renameChannel({ id: payload.id, changes: payload }));
  });

  const rollbarConfig = {
    environment: 'testenv',
    accessToken: process.env.ROLLBAR_TOKEN,
  };

  const route = createBrowserRouter([
    {
      path: paths.defaultPath,
      element: (
        <ChatRoute>
          <Provider store={store}>
            <Chat />
          </Provider>
        </ChatRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: paths.logInPath,
      element: <Provider store={store}><LoginForm /></Provider>,
    },
    {
      path: paths.signUpPath,
      element: <Provider store={store}><SignUp /></Provider>,
    },
  ]);
  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <SocketProvider socket={socket}>
          <RouterProvider router={route} />
        </SocketProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default App;
