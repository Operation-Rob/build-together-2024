import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';

const updateLocation = (map, name, newLocation) => {
    const source = map.getSource(`src_${name}`);
    if (source) {
        const data = source._data;
        // Update the coordinates for the first feature in the GeoJSON FeatureCollection
        data.features[0].geometry.coordinates = newLocation;
        // Set the new data to update the map
        source.setData(data);
    } else {
        console.error('Source not found: ', `src_${name}`);
    }
};

const addImage = (icon_loc, map, location, name, size) => {
    
    map.loadImage(icon_loc, (error, image) => {
        if (error) throw error;

        map.addImage(name, image);

        map.addSource(`src_${name}`, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: location,
                        },
                    },
                ],
            },
        });

        map.addLayer({
            id: `points_${name}`,
            type: 'symbol',
            source: `src_${name}`,
            layout: {
                'icon-image': name,
                'icon-size': size,
            },
        });
    });
}

const addRoute = async (map, route, routeIndex) => {
    
    map.addSource(`route${routeIndex}`, {
        type: 'geojson',
        data: {
            type: 'Feature',
            properties: {},
            geometry: route,
        },
    });

    map.addLayer({
        id: `route`,
        type: 'line',
        source: `route${routeIndex}`,
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': '#1f1fFF',
            'line-width': 8,
        },
    });
}

const interpolate = (start, end, ratio) => {
    return [
        start[0] + (end[0] - start[0]) * ratio,
        start[1] + (end[1] - start[1]) * ratio
    ];
}

const animateMovement = (map, name, startLocation, endLocation, duration, callback) => {
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const ratio = elapsedTime / duration;

        if (ratio < 1) {
            const currentLocation = interpolate(startLocation, endLocation, ratio);
            updateLocation(map, name, currentLocation);
            requestAnimationFrame(animate);
        } else {
            updateLocation(map, name, endLocation);
            if (callback) callback(); // Call the callback to indicate completion
        }
    }

    requestAnimationFrame(animate);
}


const animateRoute = (map, name, route, totalDuration) => {
    let currentSegment = 0;
    const numSegments = route.length - 1;
    const segmentLengths = [];
    let totalLength = 0;
    
    // calculate the length of each segment:
    for (let i = 0; i < numSegments; i++) {
        const length = Math.sqrt(
            Math.pow(route[i + 1][0] - route[i][0], 2) + 
            Math.pow(route[i + 1][1] - route[i][1], 2)
        );
        segmentLengths.push(length);
        totalLength += length;
    }

    // calculate the total of all segment lengths
    const segmentDurations = segmentLengths.map(length => (length / totalLength) * totalDuration);

    function nextSegment() {
        if (currentSegment < numSegments) {
            animateMovement(map, name, route[currentSegment], route[currentSegment + 1], segmentDurations[currentSegment], () => {
                currentSegment++;
                nextSegment(); // Recursively call nextSegment after the current animation completes
            });
        }
    }
    nextSegment(); // Start the first segment
}

// const fetchRoute = async () => {
//     const query = await fetch(`route${routeIndex}.json`, { method: 'GET' });
//     const json = await query.json();
//     return json.routes[0].geometry; // Assuming first route and its geometry
// };

const Map = ({renderAmbulance}) => {
	mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

	const mapContainer = useRef(null);
	const [lng, setLng] = useState(115.82244);
	const [lat, setLat] = useState(-31.940643);
	const [zoom, setZoom] = useState(13);
    const [map, setMap] = useState(null);

    const [theRoute, setRoute] = useState([]);

    const [hasRendered, setHasRendered] = useState(false);

	useEffect(() => {
		if (mapContainer.current && !mapContainer.current.map) {
			const map = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/mapbox/streets-v12',
				center: [lng, lat],
				zoom: zoom,
			});
            
			map.on('load', async () => {
                addImage('hospital.png', map, [115.82244, -31.940643], 'myHospital', 0.15);
    
                
			});

			map.on('move', () => {
				setLng(map.getCenter().lng.toFixed(4));
				setLat(map.getCenter().lat.toFixed(4));
				setZoom(map.getZoom().toFixed(2));
			});
            
			// Save the map instance to the container to avoid reinitialization
			mapContainer.current.map = map;

            setMap(map);

			// Cleanup function to remove the map instance
			return () => {
				map.remove();
				mapContainer.current.map = null;
			};
		}
	}, []); // Only depend on mapContainer ref

    useEffect(() => {
        const fetchRoute = async () => {
            const query = await fetch(`route1.json`, { method: 'GET' });
            const json = await query.json();
            return json.routes[0].geometry; // Assuming first route and its geometry
        };

        const initiateAnimation = async () => {
            if (renderAmbulance && map) {
                console.log('Rendering ambulance...');
                setHasRendered(true);
                const route = await fetchRoute();
                await addRoute(map, route, 1);
                
                setRoute(route.coordinates);
                setTimeout(() => {
                    addImage('ambulance.png', map, [115.81244, -31.930643], 'ambulance', 0.02);
                    setRoute(route.coordinates);
                    animateRoute(map, 'ambulance', route.coordinates, 40000);
                }, 1000);
            }
        };
    
        initiateAnimation();
    }, [renderAmbulance, map, theRoute, hasRendered]);

	return (
		<div>
			<div
				ref={mapContainer}
				className="map-container"
				style={{ width: '100%', height: '100vh' }}
			/>
		</div>
	);
};

export default Map;
