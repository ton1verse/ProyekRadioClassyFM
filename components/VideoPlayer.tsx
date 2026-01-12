'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getEmbedInfo } from '@/lib/youtube';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface VideoPlayerProps {
    url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;
    if (!url) return null;

    const { url: embedUrl, type } = getEmbedInfo(url);

    if (type === 'spotify' || type === 'iframe') {
        return (
            <div className='relative w-full h-full bg-black rounded-lg overflow-hidden'>
                <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ borderRadius: type === 'spotify' ? '12px' : '0' }}
                />
            </div>
        );
    }

    return (
        <div className='relative w-full h-full bg-black rounded-lg overflow-hidden'>
            <ReactPlayer
                url={embedUrl}
                width='100%'
                height='100%'
                controls={true}
                className='absolute top-0 left-0'
            />
        </div>
    );
}
