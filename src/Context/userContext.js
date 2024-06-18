import { createContext , useState} from 'react';
import App from '../App';

const userContext = createContext('light');

export default function UserContext() {
   
    const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

    return (
        <userContext.Provider value={{currentUser,setCurrentUser}}>
          <App />
        </userContext.Provider>
    );
  }