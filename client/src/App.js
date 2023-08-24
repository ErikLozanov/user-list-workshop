import {useEffect, useState} from 'react';

import * as userService from "../src/services/userService.js";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Search from "./components/Search";
import './App.css';
import UserList from "./components/UserList";
import CreateUser from './components/CreateUser.js';

function App() {

  const [users,setUsers] = useState([]);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    imageUrl: '',
    phoneNumber: '',
      country:'',
      city:'',
      street:'',
      streetNumber:'',
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [addUser, setAddUser] = useState(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState('');
 

  const onClose = () => {
    setAddUser(null);
  }

  const onDeleteClick = async (userId,onClose) => {
    //Delete from Server
    const userA = await userService.delUser(userId)

    //Delete from VDom
    setUsers(users.filter(u => u._id !== userId));

    //Close dialog after clicking delete
    onClose();
  }

  const onAddUserClick = () => {
    setAddUser(true);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData(e.currentTarget);

    let firstName = formData.get('firstName');
    let lastName = formData.get('lastName');
    let email = formData.get('email');
    let imageUrl = formData.get('imageUrl');
    let phoneNumber = formData.get('phoneNumber');
    let street = formData.get('street');
    let streetNumber = formData.get('streetNumber');
    let city = formData.get('city');
    let country = formData.get('country');

    //Send Ajax to the server
    const createdUser = await userService.addUser({firstName,lastName,email,phoneNumber,imageUrl,address:{country,city,street,streetNumber}});
    
    setUsers(state => [...state, createdUser.user]);
    onClose();
  }

  const onEditUser = async (e,userId, onClose) => {
    e.preventDefault();

    let formData = new FormData(e.currentTarget);

    let firstName = formData.get('firstName');
    let lastName = formData.get('lastName');
    let email = formData.get('email');
    let imageUrl = formData.get('imageUrl');
    let phoneNumber = formData.get('phoneNumber');
    let street = formData.get('street');
    let streetNumber = formData.get('streetNumber');
    let city = formData.get('city');
    let country = formData.get('country');

    console.log(Object.fromEntries(formData));
    console.log(userId);
    //Send Ajax to the server
    const editUser = await userService.editUser(userId,{firstName,lastName,email,phoneNumber,imageUrl,address:{country,city,street,streetNumber}});
    console.log(editUser);
    setUsers(state => state.map(x=> x._id === userId ? editUser.user : x));
    onClose();
  }

  const formChangeHandler = (e) => {
    setFormValues(state => ({...state, [e.target.name] : e.target.value}));
  }

  const onSearch = (e) => {
    e.preventDefault();

    let formData = new FormData(e.currentTarget);

    let criteria = formData.get('criteria');
    let search = formData.get('search');
    let searchCrit = null;
    switch (criteria) {
      case 'First Name': searchCrit = 'firstName';   break;
      case 'Last Name': searchCrit = 'lastName';   break;
      case 'Email': searchCrit = 'email';   break;
      case 'Phone': searchCrit = 'phoneNumber';   break;
    }

    if(!searchCrit) {
      alert('Please select a criteria!');
      return;
    }
    setUsers(users.filter(x => x[searchCrit].includes(search)));
  }

  const closeBtn = () => {
    setUsers(users);
  }

 useEffect(() => {
    userService.getAll()
    .then(users => {
      setIsLoaded(true);
      setUsers(users);
      setQ(users);
    }).catch(err => {
      console.log('Error' + err);
    })
  }, []);


  if(!isLoaded) {
    return <div className="spinner"></div>;
  } else {
    return (
      <>
        <Header />
  
        <main className='main'>
        <section className="card users-container">
          <Search closeBtn={closeBtn} onSearch={onSearch}/>
          <UserList 
          users={users} 
          onDeleteClick={onDeleteClick} 
          onEditUser={onEditUser}
          />
          {addUser && <CreateUser 
          onClose={onClose} 
          onSubmit={onSubmit} 
          formValues={formValues}
          formChangeHandler={formChangeHandler}
          />}
          <button className="btn-add btn" onClick={onAddUserClick}>Add new user</button>
  
      </section>
  
        </main>
  
        <Footer />
      </>
    );
  }
}

export default App;
