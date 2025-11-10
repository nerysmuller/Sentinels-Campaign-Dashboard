// ============================================
// PARTICLE ANIMATION SYSTEM
// ============================================

class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles');
        this.particleCount = 30;
        this.particles = [];
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement
