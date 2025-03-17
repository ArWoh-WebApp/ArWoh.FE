import DashboardPage from "@/components/admin/AdminDashboard";

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-[1400px] mx-auto px-6 py-24">
                <div className="space-y-4 text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Skibidi admin page
                    </p>
                </div>
                <DashboardPage />
            </div>
        </main>
    )
}
