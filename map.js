

mapboxgl.accessToken = 'pk.eyJ1IjoieWFuc3VuMjAyMCIsImEiOiJjazg4dmFsbGcwMGcwM2xxc2Zla21zZG91In0.Kkqjs0MWxmSEeqe7yO-k5g';
const map = new mapboxgl.Map({
    container: 'map',
    //style: 'mapbox://styles/yansun2020/ck8ad7rpg0m9r1ipbqa4rgvk0',
    style: 'mapbox://styles/yansun2020/ckygzwxdq16un14lq52h6kr85',
    center: [13.529217270878632, 52.49580506268026],
    zoom: 2,
    pitch: 0,
    bearing: 0,
    });

    mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
    map.addControl(new MapboxLanguage({
      defaultLanguage: 'zh-Hans'
    }));
    


map.on('load', async () => {
    const response = await fetch(
        'data/route000.geojson'
    );
    const data = await response.json();
    // save full coordinate list for later
    const coordinates = data.features[0].geometry.coordinates;

    // start by showing just the first coordinate
    data.features[0].geometry.coordinates = [coordinates[0]];
    map.addSource('route001', {
        type: 'geojson',
        data: 'data/route000.json'
    });


    map.addSource('point001', {
        type: 'geojson',
        data: 'data/point000.geojson',
        cluster: true,
        clusterMaxZoom: 14,
        clusterMinPoints:5,
        clusterRadius: 50
    });


    map.addLayer({
        'id': 'route001',
        'type': 'line',
        'source': 'route001',
        'paint': {
            'line-color': '#007A78',
            'line-width': 2
        }
    });
   
    map.addLayer({
        'id': 'unclustered-point',
        'type': 'circle',
        'source': 'point001',
        'filter': ['!', ['has', 'point_count']],
        'paint': {
            'circle-color': '#386cb0',
            'circle-radius': 5,
         
        }
    });
    map.addLayer({
        'id': 'text',
        'type': 'symbol',
        'source': 'point001',
        'layout': {
            'text-field':['get','Location'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-anchor': 'bottom-right',
            'text-offset':[-0.5,-0.5],
            'text-size': 14
        },
        'paint': {
            'text-color':'#08519c'
        }
    });

    map.addLayer({
        'id': 'text1',
        'type': 'symbol',
        'source': 'point001',
        'layout': {
            'text-field':['get','Location1'],
            'text-allow-overlap':true,
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-anchor': 'bottom-right',
            'text-offset':[-1,-1],
            'text-size': 24
        },
        'paint': {
            'text-color':'#08519c'
        }
    });
    
   
      map.jumpTo({ 'center': coordinates[0], 'zoom': 6 });
        map.setPitch(30);

        // on a regular basis, add more coordinates from the saved list and update the map
         let i = 0;
        const timer = setInterval(() => {
          if (i < coordinates.length) {
              data.features[0].geometry.coordinates.push(coordinates[i]);
              map.getSource('route001').setData(data);
             map.panTo(coordinates[i]);
            i++;
      } else {
            window.clearInterval(timer);
         }
    }, 100);
   
    map.addLayer({
        'id': 'point',
        'type': 'circle',
        'source': 'point001',
        'filter': ['has', 'point_count'],
        'paint': {
            'circle-color': ['step', ['get', 'point_count'],
                '#2b8cbe', 6,
                '#74a9cf', 12,
                '#bdc9e1'
            ],
            'circle-radius': ['step', ['get', 'point_count'],
                10, 5,
                15, 10,
                20]
        }
    });

    map.addLayer({
        'id': 'point-count',
        'type': 'symbol',
        'source': 'point001',
        'filter': ['has', 'point_count'],
        'layout': {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });
   
    
   

    









})
