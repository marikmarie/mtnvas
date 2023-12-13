import { useState, useEffect } from 'react'

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const useScreenWidth = (): ScreenSize => {
	const [width, setWidth] = useState<ScreenSize>(getScreenSize(window.innerWidth))

	useEffect(() => {
		const handleResize = () => setWidth(getScreenSize(window.innerWidth))

		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return width
}

const getScreenSize = (width: number): ScreenSize =>
	width <= 480 ? 'xs' : width <= 640 ? 'sm' : width <= 1024 ? 'md' : width <= 1440 ? 'lg' : 'xl'
