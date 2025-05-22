import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
        <Image src="/logo/logo.svg" alt="Workout Shop Logo" width={120} height={40} />
    </Link>

  );
}