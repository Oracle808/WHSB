/*  ___ ___     _____     _________  ___ ___     _____    _______   ._.
 /   |   \   /  _  \   /   _____/ /   |   \   /  _  \   \      \  | |
/    ~    \ /  /_\  \  \_____  \ /    ~    \ /  /_\  \  /   |   \ | |
\    Y    //    |    \ /        \\    Y    //    |    \/    |    \ \|
 \___|_  / \____|__  //_______  / \___|_  / \____|__  /\____|__  / __
       \/          \/         \/        \/          \/         \/  \/

 Copyright Hashan Punchihewa 10C */
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(){$(document).ready(function(){var a=$("#new-recording");$("#recordings .add-item").on("click",function(b){a.stop(),a.slideToggle(),b.preventDefault()})})},{}]},{},[1]);