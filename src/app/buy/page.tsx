'use client'
import React, { useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
const options = ["REact", "Vre"]

function Buy() {
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState("")
  return (
    <div className='buyContainer'>
      <h1 style={{ color: "red", paddingBottom: "10px", margin: "auto auto" }}>For testing purpose you can buy tokens for free.</h1>
      <div className='buyInput'>
        <input placeholder='Token Amount' type='text' style={{ borderRadius: "10px", paddingLeft: "10px", color: "black", fontWeight: "bold", outline: "none" }}></input>
        <div className='dropdown'>
          <div className='dropdown-btn' onClick={(e) => setIsActive(!isActive)}>
            {selected || "Choose Token"}
            <DownOutlined />
          </div>
          {isActive && (
            <div className='dropdown-content'>
              {options.map((opt) => (
                <div className='dropdown-item' onClick={(e) => {
                  setSelected(opt);
                  setIsActive(false);
                }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className='buyButton' disabled={false} onClick={() => { }}>Get Token</button>
    </div>
  )
}

export default Buy