<script lang="ts">
	import { login } from '$lib/db/users.remote';
</script>

<div class="login-container">
	<form {...login}>
		<label>
			<p>Username</p>
			<input type="text" name="username" required />
		</label>
		<label>
			<p>Password</p>
			<input type="password" name="password" required />
		</label>
		<button type="submit">Login</button>
	</form>
</div>
