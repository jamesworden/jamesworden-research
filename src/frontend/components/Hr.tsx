import React from 'react'

interface Hr {}

export const Hr: React.FC<Hr> = ({}) => {
  return (
    <hr
      style={{
        border: 0,
        height: '1px',
        background: '#333',
        backgroundImage: 'linear-gradient(to right, #ccc, #333, #ccc)'
      }}
    />
  )
}
