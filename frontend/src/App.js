import React, { useState } from "react";
import OrdersDashboard from "./OrdersDashboard";
import Login from "./Login";
import Signup from "./Signup";

import {
BrowserRouter,
Routes,
Route,
Navigate
} from "react-router-dom";

import {
AppBar,
Toolbar,
Typography,
Box,
TextField,
Button
} from "@mui/material";

function App(){

const [search,setSearch]=useState("");

const token = localStorage.getItem("token");

const handleLogout = () => {
localStorage.removeItem("token");
window.location="/login";
};

return(

<BrowserRouter>

{token && (

<AppBar position="static" sx={{background:"#1e3a5f"}}>

<Toolbar
sx={{
display:"flex",
justifyContent:"space-between",
paddingX:4,
minHeight:"70px"
}}
>
<Box display="flex" alignItems="center" gap={2}>

<img
src="/logo.png"
alt="logo"
style={{
height:"100px",
width:"150px",
objectFit:"contain"
}}
/>

<Typography
variant="h5"
sx={{
fontWeight:600,
fontFamily:"Helvetica",
letterSpacing:0.5
}}
>
Jewelry Production Planning
</Typography>

</Box>

<Box display="flex" gap={2}>

<TextField
placeholder="Search Orders..."
size="small"
value={search}
onChange={(e)=>setSearch(e.target.value)}
sx={{background:"white",borderRadius:"6px"}}
/>

<Button
variant="contained"
color="error"
onClick={handleLogout}
>
Logout
</Button>

</Box>

</Toolbar>

</AppBar>

)}

<Box sx={{maxWidth:"1400px",margin:"auto",padding:"24px"}}>

<Routes>

<Route
path="/"
element={
token
? <OrdersDashboard search={search}/>
: <Navigate to="/login"/>
}
/>

<Route
path="/login"
element={!token ? <Login/> : <Navigate to="/"/>}
/>

<Route
path="/signup"
element={!token ? <Signup/> : <Navigate to="/"/>}
/>

</Routes>

</Box>

</BrowserRouter>

);

}

export default App;