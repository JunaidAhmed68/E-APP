// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   InputBase,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   useMediaQuery,
// } from "@mui/material";
// import { Menu, Search } from "@mui/icons-material";
// import { styled, useTheme } from "@mui/material/styles";

// const SearchBox = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: theme.palette.common.white,
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(1),
//     width: "auto",
//   },
// }));

// const SearchInput = styled(InputBase)(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: "100%",
// }));

// const suggestions = ["smartphones", "laptops", "fragrances", "skincare", "groceries"];

// export default function NavBarWithSearch({ onSearch }) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredSuggestions, setFilteredSuggestions] = useState([]);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     if (value.length > 0) {
//       const filtered = suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()));
//       setFilteredSuggestions(filtered);
//     } else {
//       setFilteredSuggestions([]);
//     }
//   };

//   const handleSearch = async (term) => {
//     setFilteredSuggestions([]);
//     try {
//       const res = await fetch(`https://dummyjson.com/products/category/${term}`);
//       const data = await res.json();
//       onSearch(data.products || [], term);
//     } catch (err) {
//       onSearch([], term);
//     }
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setSearchTerm(suggestion);
//     handleSearch(suggestion);
//   };

//   return (
//     <AppBar position="static">
//       <Toolbar>
//         {isMobile && (
//           <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
//             <Menu />
//           </IconButton>
//         )}
//         <SearchBox>
//           <SearchInput
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             endAdornment={<Search onClick={() => handleSearch(searchTerm)} className="cursor-pointer" />}
//           />
//           {filteredSuggestions.length > 0 && (
//             <div className="absolute bg-white w-full z-50 shadow rounded mt-1 max-h-60 overflow-y-auto">
//               {filteredSuggestions.map((s, idx) => (
//                 <div
//                   key={idx}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleSuggestionClick(s)}
//                 >
//                   {s}
//                 </div>
//               ))}
//             </div>
//           )}
//         </SearchBox>
//       </Toolbar>
//       <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
//         <List>
//           <ListItem button>
//             <ListItemText primary="Home" />
//           </ListItem>
//           <ListItem button>
//             <ListItemText primary="About" />
//           </ListItem>
//         </List>
//       </Drawer>
//     </AppBar>
//   );
// }
