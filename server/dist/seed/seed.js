import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { User } from "../models/User.model.js";
import { Membership } from "../models/Membership.model.js";
import { Attendance } from "../models/Attendance.model.js";
import { Payment } from "../models/Payment.model.js";
import { Gallery } from "../models/Gallery.model.js";
import { Blog } from "../models/Blog.model.js";
import { Trainer } from "../models/Trainer.model.js";
import { hashPassword } from "../utils/password.js";
import { slugify } from "../utils/slug.js";
import { seedCmsContent } from "./cms-seed.js";
const GALLERY_SEED = [
    { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop", alt: "Gym floor", category: "gym" },
    { src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop", alt: "Weight training", category: "workout" },
    { src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop", alt: "Cardio zone", category: "equipment" },
    { src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop", alt: "Group class", category: "workout" },
    { src: "https://images.unsplash.com/photo-1540497077202-7a8b3d8e8f3e?w=600&h=400&fit=crop", alt: "Personal training", category: "members" },
    { src: "https://images.unsplash.com/photo-1623874514711-0f321325f318?w=600&h=400&fit=crop", alt: "Locker room", category: "gym" },
    { src: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=400&fit=crop", alt: "Yoga session", category: "workout" },
    { src: "https://images.unsplash.com/photo-1593079831268-3381b0f4c77b?w=600&h=400&fit=crop", alt: "CrossFit area", category: "equipment" },
];
const TRAINER_SEED = [
    {
        name: "K N Raju",
        role: "Founder & Head Trainer",
        specialty: "Bodybuilding & Strength",
        experience: "15+ years",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop",
        bio: "Founder of INDIAN GYM with over 15 years of transforming lives through fitness.",
        certificates: ["ACE Certified", "ISSA Sports Nutrition"],
        social: { instagram: "indian_gym23" },
        sortOrder: 1,
    },
    {
        name: "Priya Sharma",
        role: "Senior Fitness Coach",
        specialty: "HIIT & Weight Loss",
        experience: "8+ years",
        image: "https://images.unsplash.com/photo-1594381898411-8465977c892e?w=400&h=500&fit=crop",
        bio: "Specialized in high-intensity training and sustainable weight management.",
        certificates: ["NASM CPT"],
        sortOrder: 2,
    },
    {
        name: "Arjun Reddy",
        role: "Strength Coach",
        specialty: "Powerlifting & CrossFit",
        experience: "10+ years",
        image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop",
        bio: "Competitive powerlifter helping members achieve peak strength.",
        certificates: ["CrossFit L2"],
        sortOrder: 3,
    },
    {
        name: "Meera Patel",
        role: "Yoga & Wellness Instructor",
        specialty: "Yoga & Flexibility",
        experience: "6+ years",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop",
        bio: "Certified yoga instructor focusing on mind-body wellness.",
        certificates: ["RYT 500"],
        sortOrder: 4,
    },
];
const BLOG_SEED = [
    {
        title: "10 Essential Exercises for Beginners",
        excerpt: "Start your fitness journey with these foundational movements.",
        content: "Starting your fitness journey can feel overwhelming. Focus on compound movements like squats, push-ups, and rows to build a strong foundation...",
        category: "Training",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=350&fit=crop",
        readTime: "5 min",
        publishedAt: new Date("2025-06-15"),
    },
    {
        title: "Nutrition Tips for Muscle Building",
        excerpt: "Learn what to eat before and after workouts for maximum gains.",
        content: "Muscle building requires consistent training and proper nutrition. Prioritize protein intake and eat balanced meals around your workouts...",
        category: "Nutrition",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=350&fit=crop",
        readTime: "7 min",
        publishedAt: new Date("2025-06-10"),
    },
    {
        title: "The Science of Recovery",
        excerpt: "Why rest days are just as important as training days.",
        content: "Recovery is when your body adapts and grows stronger. Sleep, hydration, and active recovery all play critical roles...",
        category: "Wellness",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=350&fit=crop",
        readTime: "6 min",
        publishedAt: new Date("2025-06-05"),
    },
    {
        title: "HIIT vs Steady-State Cardio",
        excerpt: "Which cardio approach is right for your fitness goals?",
        content: "Both HIIT and steady-state cardio have benefits. HIIT burns more calories in less time, while steady-state improves endurance...",
        category: "Training",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=350&fit=crop",
        readTime: "8 min",
        publishedAt: new Date("2025-05-28"),
    },
];
async function seed() {
    await connectDatabase();
    await seedCmsContent();
    const userCount = await User.countDocuments();
    if (userCount > 0) {
        console.log("Database already seeded. Skipping user data.");
        await disconnectDatabase();
        return;
    }
    console.log("Seeding database...");
    const adminHash = await hashPassword("Admin@123");
    const memberHash = await hashPassword("Member@123");
    const admin = await User.create({
        email: "admin@gym.com",
        phone: "9999999999",
        name: "Gym Admin",
        passwordHash: adminHash,
        role: "admin",
    });
    const member = await User.create({
        email: "member@gym.com",
        phone: "8142113631",
        name: "Demo Member",
        passwordHash: memberHash,
        role: "member",
        goal: "Muscle Gain",
    });
    const now = new Date();
    const membershipEnd = new Date(now.getTime() + 180 * 86400000);
    await Membership.create({
        userId: member._id,
        planId: "premium",
        planName: "Half Yearly",
        startDate: now,
        endDate: membershipEnd,
        status: "active",
        amount: 14999,
    });
    const dates = [];
    for (let i = 0; i < 14; i++) {
        const d = new Date(now.getTime() - i * 86400000);
        if (d.getDay() !== 0)
            dates.push(d.toISOString().split("T")[0]);
    }
    await Attendance.insertMany(dates.map((date, i) => ({
        userId: member._id,
        date,
        checkIn: "06:30",
        checkOut: i % 3 === 0 ? undefined : "08:15",
    })));
    await Payment.insertMany([
        {
            userId: member._id,
            memberName: member.name,
            amount: 14999,
            method: "upi",
            status: "completed",
            planName: "Half Yearly",
            date: new Date(now.getTime() - 2 * 86400000),
            reference: "UPI-482910",
        },
        {
            userId: member._id,
            memberName: member.name,
            amount: 2999,
            method: "cash",
            status: "completed",
            planName: "Monthly",
            date: new Date(now.getTime() - 35 * 86400000),
        },
        {
            userId: member._id,
            memberName: member.name,
            amount: 7999,
            method: "upi",
            status: "pending",
            planName: "Quarterly",
            date: now,
            reference: "UPI-PENDING",
        },
    ]);
    await Gallery.insertMany(GALLERY_SEED.map((item, i) => ({
        ...item,
        isPublished: true,
        sortOrder: i + 1,
    })));
    await Blog.insertMany(BLOG_SEED.map((blog) => ({
        ...blog,
        slug: slugify(blog.title),
        isPublished: true,
    })));
    await Trainer.insertMany(TRAINER_SEED);
    console.log("Seed complete.");
    console.log(`Admin: admin@gym.com / Admin@123 (id: ${admin._id})`);
    console.log(`Member: member@gym.com / Member@123 (id: ${member._id})`);
    await disconnectDatabase();
}
seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
