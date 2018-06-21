import _ from 'lodash';
import * as firebase from 'firebase';
import events from 'events';

import Heatmap from './heatmap';

class Hotometer extends events.EventEmitter{
    constructor(token) {
        super();

        this.token = token;
        this.state = 'home';

        this.heatmap = new Heatmap(this.display);

        this.display = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.initFirebase();
        this.initHeatmapWatch();

        document.addEventListener('mousedown', _.throttle(this::this.addNewClick, 300));
    }

    calculatePercentage(value, fullPercent) {
        return Math.floor((value * 100) / fullPercent);
    }

    async addNewClick(e) {
        let x = e.clientX,
            y = e.clientY;

        let databaseRef = this.database().ref(`/page/${this.state}/${x}/${y}`);

        let databaseData = await databaseRef.once('value'),
            data = databaseData.val() || 0;
        data++;

        databaseRef.set(data);
    }

    async initFirebase() {
        firebase.initializeApp({
            apiKey: "AIzaSyDUyAK_YgQ60M9y8FY5Q_lccL-ACkOXlKc",
            authDomain: "quentin-b880c.firebaseapp.com",
            databaseURL: "https://quentin-b880c.firebaseio.com",
            projectId: "quentin-b880c",
            storageBucket: "quentin-b880c.appspot.com",
            messagingSenderId: "1077925836180"
          });

        this.database = firebase.database;

        try {
            await firebase.auth().signInWithCustomToken(this.token);
        } catch (e) {
            console.log(e);
            throw new Error('Invalid token!');
        }
    }

    initHeatmapWatch() {
        this.database().ref(`/page`).on('value', (snapshot) => {
            this.emit('updateHeatmap', _.get(snapshot.val(), this.state) || null);
        } );
    }

    changeState(state) {
        this.state = state;
    }

    generateHeatmap(data) {
        this.heatmap.setData(data);
    }

    initHeatmap() {
        this.on('updateHeatmap', this::this.generateHeatmap);
    }
}

const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1OGRiNWI2M2QyYTQzMGIzZTg4ZWVhNGY0Y2FmMzIxMDIzNTk1MDA1MWE0YTA1OTQ5YTc1OGU0YTUxYjY4YTUwIiwiaWF0IjoxNTEzMzc2NDQ2LCJleHAiOjE1MTMzODAwNDYsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHl0b29sa2l0Lmdvb2dsZWFwaXMuY29tL2dvb2dsZS5pZGVudGl0eS5pZGVudGl0eXRvb2xraXQudjEuSWRlbnRpdHlUb29sa2l0IiwiaXNzIjoiZmlyZWJhc2UtYWRtaW5zZGstdmd5ZDVAcXVlbnRpbi1iODgwYy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLXZneWQ1QHF1ZW50aW4tYjg4MGMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20ifQ.FEWp-tn5OpIr_Aa52isMi8via8BaXSpf_LIe5m4JfABYVKBBTSudhYebgFjcrKxUQYbp9u6X7SUEvt6EyUDy874mW-gJPQpjdgARbuWZoiqaJG7-4eZIEMB6Phw7PpuKDv17y5yVoXcv7lEnnibi4DF4kRphJCXaaf3Gnneu7Z_TynJ8QwPkMy4nP4aWxLpPJhh3M9OIaTNTm0J_jpjDSvI1W0Du5XTLtvMeWUSuMQdhMUz-6MkvgulrZaqFR7RPKut7wh--i0qRrNFNoon-sdgQC2EZ2FV_RAiiyF-l2nWAJ3NamFBYkpGABtf3LBfK3lJx5Lw-goINUbFq1GnfsA';

const hotometer = new Hotometer(token);

hotometer.changeState('other-page');

hotometer.initHeatmap();