<script lang="ts">
	import { goto } from '$app/navigation';
	import "../../app.css";
</script>

<main class="welcome-page">
	<img src="/QuantilytixO.png" alt="Quantilytix Logo" class="logo logo-right">
	<div class="glass-container">
		<h1>🌟 Welcome to Glenwood Community Preschool</h1>
		<p class="subtitle">Apply for the Principal Position</p>

		<div class="button-group">
			<button class="btn primary" on:click={() => goto('/authentication/sign-in')}>Sign In</button>
			<button class="btn secondary" on:click={() => goto('/authentication/registration')}>Register</button>
		</div>
	</div>
</main>

<style>
    .welcome-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('/bg-image.jpg') no-repeat center center fixed;
        background-size: cover;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .glass-container {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 3rem 4rem;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        text-align: center;
        color: #fff;
        max-width: 500px;
    }

    h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(to right, #ff6a00, #ee0979);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .subtitle {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        color: #f0f0f0;
    }

    .button-group {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn.primary {
        background-color: #ff6a00;
        color: white;
    }

    .btn.primary:hover {
        background-color: #e65c00;
    }

    .btn.secondary {
        background-color: transparent;
        border: 2px solid #fff;
        color: #fff;
    }

    .btn.secondary:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    /* ✅ Logos */
    .logo {
        position: absolute;
        max-width: 30%;
        height: auto;
        object-fit: contain;
    }


    /* Right Logo */
    .logo-right {
        bottom: 20px;
        right: 20px;
        width: clamp(100px, 15vw, 200px);
    }
</style>
