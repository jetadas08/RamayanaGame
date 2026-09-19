'use client';
import {useRouter} from 'next/navigation';
import {HerbsMap} from '@/components/herbs-map';
export function MountainChapterEntry(){const router=useRouter();return <HerbsMap onBack={()=>router.push('/journey/hanuman')}/>;}
