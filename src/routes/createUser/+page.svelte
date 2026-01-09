<script>
	import { createNewUser } from '$lib/db/users.remote';
</script>

<div class="create-user-container">
	<form {...createNewUser}>
		<label>
			<p>Username</p>
			<input type="text" name="username" />
		</label>

		<label>
			<p>Password</p>
			<input type="text" name="password" />
		</label>
		<button type="submit">Create user</button>
	</form>
</div>
