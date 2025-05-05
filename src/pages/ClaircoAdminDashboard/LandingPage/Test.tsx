// import { useCallback, useEffect, useRef, useState } from 'react';

// const CartComponent = () => {
//     // const [cartTotal, setCartTotal] = useState(100);
//     // const [discount, setDiscount] = useState(0);

//     const applyDiscount = useCallback(async () => {
//         await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate API delay
//         setCartTotal(cartTotal - discount); // Stale closure bug!
//     }, []); // ❌ Empty dependency array → `cartTotal` & `discount` stay outdated
//     // const [count, setCount] = useState(0);

//     // ❌ Stale closure issue in an event listener:
//     useEffect(() => {
//         const handleClick = () => alert(`Count: ${count}`); // ❌ Captured stale state

//         window.addEventListener('click', handleClick);
//         return () => window.removeEventListener('click', handleClick);
//     }, []); // ❌ No dependencies, state won’t update

//     //✅ Fix: Add dependencies to useEffect
//     useEffect(() => {
//         const handleClick = () => alert(`Count: ${count}`); // ✅ Updated correctly

//         window.addEventListener('click', handleClick);
//         return () => window.removeEventListener('click', handleClick);
//     }, [count]); // ✅ Includes state dependency

//     // ❌ Stale closure issue in an API call:
//     const fetchData = async () => {
//         await new Promise((resolve) => setTimeout(resolve, 3000));
//         console.log(`Final count: ${count}`); // ❌ Stale closure, may print old count
//     };

//     // ✅ Fix: Store state in a useRef
//     const countRef = useRef(count);

//     useEffect(() => {
//         countRef.current = count; // ✅ Always holds latest state
//     }, [count]);

//     const fetchData = async () => {
//         await new Promise((resolve) => setTimeout(resolve, 3000));
//         console.log(`Final count: ${countRef.current}`); // ✅ Always updated
//     };

//     // const [cartTotal, setCartTotal] = useState(100);
//     // const [discount, setDiscount] = useState(10);

//     // ❌ Problematic Code (Stale Closure in Async API Call)

//     const processPayment1 = async () => {
//         await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulating payment delay
//         console.log(`Final payment: ${cartTotal - discount}`); // ❌ Stale closure issue!
//     };

//     // ✅ Solution: Store the Latest State Using useRef

//     const cartTotalRef = useRef(cartTotal);
//     const discountRef = useRef(discount);
//     useEffect(() => {
//         cartTotalRef.current = cartTotal;
//         discountRef.current = discount;
//     }, [cartTotal, discount]);

//     const processPayment2 = async () => {
//         await new Promise((resolve) => setTimeout(resolve, 3000));
//         console.log(`Final payment: ${cartTotalRef.current - discountRef.current}`); // ✅ Always gets latest values
//     };

//     //   ❌ Memoized function with stale closure issue:

//     //   const handleClick = useCallback(() => {
//     //     console.log(`Current count: ${count}`); // ❌ Captures initial count only
//     //   }, []); // ❌ Empty dependency array → stale state

//     // ❌ Example of a stale closure issue:
//     const [count, setCount] = useState(0);

//     const handleClick = () => {
//         setTimeout(() => {
//             alert(`Count: ${count}`); // ❌ Captures stale count value
//         }, 3000);
//     };

//     // ✅ Fix: Use functional updates inside useState
//     setCount((prevCount) => prevCount + 1); // ✅ Always uses latest state

//     return <button onClick={applyDiscount}>Apply Discount</button>;
// };
export {};
