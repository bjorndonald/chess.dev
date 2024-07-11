import React from 'react'
import icon from '@/assets/images/fulllogo.png'
import Image from 'next/image'

const CodeTemplate = ({link}: {link: string}) => {
  return (
    <div style={{
      marginBottom: 100,
      backgroundColor: "#f0f0f0"
    }}>
      <div style={{
        margin: "48px auto",
        maxWidth: "600px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}>
          <Image style={{
            height: 48,
            width: "auto"
          }} src={icon} alt='' />
        </div>

        <div style={{
          width: "100%",
          backgroundColor: "white",
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 42,
          paddingRight: 42
        }}>
          <h1 style={{
            fontSize: 32,
            lineHeight: 42,
            fontWeight: "bold",
            
          }}>Your link: {link}</h1>
          <br />
          <br />
          <br />
        </div>
        <p>
          This is the link for the game you requested. Make sure the code is not seen by another player they might use that to cheat on the game. Have a good chess game
        </p>
      </div>
    </div>
  )
}

export default CodeTemplate