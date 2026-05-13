export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>

        <p className="text-gray-500 mt-2">
          You don’t have permission to access this area.
        </p>
      </div>
    </div>
  );
}
