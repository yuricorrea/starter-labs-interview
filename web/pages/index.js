
import AppHead from '../src/components/AppHead';
import Minter from '../src/components/mint';
import Provider from  '../src/context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Mint() {

  return (
    <Provider>
      <AppHead />
      <Minter />
    </Provider>
  )
  
}
