import * as THREE from '../build/three.module.js';
import Stats from './nurbsImpl/libs/stats.module.js';

import { NURBSSurface } from './nurbsImpl/NURBSSurface.js';

const POINTS = [
	[ 1, 5, 1 ],
	[ 2, 3, 0 ],
	[ 3, 2, 2 ],
	[ 4, 4, 1 ],
	[ 5, 1, 2 ],
	[ 6, 2, 0 ],
	[ 7, 3, 3 ],
	[ 10, 2, 3 ],
	[ 11, 2, 1 ],
	[ 13, 4, 3 ],
	[ 14, 3, 3],
	[ 15, 6, 4 ],
	[ 17, 3, 1 ],
	[ 20, 4, 3],
];
const multiplier = 50;

var container, stats;
var camera, scene, renderer;
var group;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 0, 150, 750 );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0e68c );
	scene.add( new THREE.AmbientLight( 0x808080 ) );
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 1, 1, 1 );
	scene.add( light );
	group = new THREE.Group();
	group.position.y = 50;
	scene.add( group );

	var nsControlPoints = [
		[
			createVector( POINTS[ 0 ] ),
			createVector( POINTS[ 1 ] ),
			createVector( POINTS[ 2 ] )
		],
		[
			createVector( POINTS[ 3 ] ),
			createVector( POINTS[ 4 ] ),
			createVector( POINTS[ 5 ] )
		],
		[
			createVector( POINTS[ 6 ] ),
			createVector( POINTS[ 7 ] ),
			createVector( POINTS[ 7 ] )
		],
		[
			createVector( POINTS[ 8 ] ),
			createVector( POINTS[ 9 ] ),
			createVector( POINTS[ 10 ] )
		],
		[
			createVector( POINTS[ 11 ] ),
			createVector( POINTS[ 12 ] ),
			createVector( POINTS[ 13 ] )
		],
	];
	var degree1 = 2;
	var degree2 = 2;
	var knots1 = [ 0, 0, 0, 1, 1, 1 ];
	var knots2 = [ 0, 0, 0, 1, 1, 1 ];
	var nurbsSurface = new NURBSSurface( degree1, degree2, knots1, knots2, nsControlPoints );

	var map = new THREE.TextureLoader().load( 'textures/Carbon.png' );
	console.log( map );
	map.wrapS = map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 16;

	function getSurfacePoint( u, v, target ) {

		return nurbsSurface.getPoint( u, v, target );

	}

	var geometry = new THREE.ParametricBufferGeometry( getSurfacePoint, 20, 20 );
	var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );
	var object = new THREE.Mesh( geometry, material );
	object.position.set( - 300, - 100, 100 );
	object.scale.multiplyScalar( 1 );
	group.add( object );

	var pts = [];
	for ( var i = 0; i < nsControlPoints.length; i ++ ) {

		for ( var j = 0; j < nsControlPoints[ i ].length; j ++ ) {

			pts.push( nsControlPoints[ i ][ j ] );

		}

	}

	console.log( pts );

	var nurbsCPGeometry = new THREE.BufferGeometry();
	nurbsCPGeometry.setFromPoints( pts );

	var nurbsCPMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff, opacity: 0.25, transparent: true } );

	var nurbsCPLine = new THREE.Line( nurbsCPGeometry, nurbsCPMaterial );
	nurbsCPLine.position.copy( object.position );
	group.add( nurbsCPLine );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function createVector( point ) {

	return new THREE.Vector4( point[ 0 ] * multiplier, point[ 1 ] * multiplier, point[ 2 ] * multiplier, 1 );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown( event ) {

	event.preventDefault();
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );
	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;

}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

}

function onDocumentMouseUp() {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentMouseOut() {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();
		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

	}

}

function animate() {

	requestAnimationFrame( animate );
	render();
	stats.update();

}

function render() {

	group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
	renderer.render( scene, camera );

}
