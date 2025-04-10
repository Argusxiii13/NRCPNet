<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>React</title>
</head>
<body>
    <div 
    id="admin-root"
    data-is-logged-in="{{ Auth::check() ? 'true' : 'false' }}"
    data-dashboard-url="{{ url('/dashboard') }}"
    @if(Auth::check())
    data-user-id="{{ Auth::user()->id }}"
    @endif
    ></div>
@viteReactRefresh
@vite('resources/js/pages/AdminPage.jsx')
</body>
</html>