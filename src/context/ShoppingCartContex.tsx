import { createContext, ReactNode,  useContext, useState } from "react";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type ShoppingCartContex = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number )=> void
    removeFromCart: (id: number )=> void
    cartQuantity: number
    cartItems: CartItem[]
}

type CartItem = {
    id: number
    quantity: number

}

//Crea Contex
const ShoppingCartContex = createContext({} as ShoppingCartContex)

//Funzione che ti permette di utilizzare UseContex
export function useShoppingCart() {
    return useContext(ShoppingCartContex)
}

//Provider

export function ShoppingCartProvider( {children} : ShoppingCartProviderProps){
    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    const cartQuantity = cartItems.reduce((quantity, item)=> item.quantity + quantity, 0)
    //Qui creo le funzioni che ho dichiarato le type sopra
    function getItemQuantity(id:number){
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id:number){
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id)== null){
                return [...currItems, {id, quantity: 1}]
            }else{
                return currItems.map(item =>{
                    if(item.id === id){
                        return{...item, quantity: item.quantity + 1}
                    }else{
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id:number){
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id)?.quantity=== 1){
                return currItems.filter(item => item.id !== id)
            }else{
                return currItems.map(item =>{
                    if(item.id === id){
                        return{...item, quantity: item.quantity - 1}
                    }else{
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id:number){
        setCartItems(currItems =>{
            return currItems.filter(item => item.id !== id)
        })
    }

    function openCart (){
        setIsOpen(true)
    }

    function closeCart(){
        setIsOpen(false)
    }
   return (
     <ShoppingCartContex.Provider value={{
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    cartItems,
    cartQuantity,
    openCart,
    closeCart}}>
    {children}
   </ShoppingCartContex.Provider>
   )
}