import React from "react";
import { RelayEnvironmentProvider } from 'react-relay/hooks';

import relayEnv from "../../createRelayEnvironment";
import BasicLayout from '../BasicLayout';
import SearchUser from "../../pages/SearchUser";

import "./App.css";

const App = () => (
  <RelayEnvironmentProvider environment={relayEnv}>
    <BasicLayout>
      <SearchUser defaultSearchText="xyy94813" />
    </BasicLayout>
  </RelayEnvironmentProvider>
);

export default App;
