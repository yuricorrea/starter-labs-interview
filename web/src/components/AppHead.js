import React from 'react';
import Head from 'next/head';

const AppHead = () => (
    <Head>
        <meta charset="utf-8" />
        <title>Labmonsters</title>
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
        <meta name="description" content="starter labs interviwe" />

        <meta property="og:title" content="Labmonsters" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="#" />
        <meta property="og:description" content="starter labs interviwe" />
        <meta property="og:image" content="static/monster-1.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
)

export default React.memo(AppHead);