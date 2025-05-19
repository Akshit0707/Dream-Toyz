"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Car,
  Clock,
  User,
  Loader2,
  ArrowRight,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

// Helper: Format time from "HH:mm:ss" or "HH:mm"
const formatTime = (timeString) => {
  try {
    return format(parseISO(`2022-01-01T${timeString}`), "h:mm a");
  } catch {
    return timeString;
  }
};

// Helper: Status badge rendering
const statusMap = {
  PENDING: { text: "Pending", className: "bg-amber-100 text-amber-800" },
  CONFIRMED: { text: "Confirmed", className: "bg-green-100 text-green-800" },
  COMPLETED: { text: "Completed", className: "bg-blue-100 text-blue-800" },
  CANCELLED: { text: "Cancelled", className: "bg-gray-100 text-gray-800" },
  NO_SHOW: { text: "No Show", className: "bg-red-100 text-red-800" },
};

const getStatusBadge = (status) => {
  const badge = statusMap[status];
  return (
    <Badge className={badge?.className || "border"}>
      {badge?.text || status}
    </Badge>
  );
};

// Cancel confirmation dialog
const CancelDialog = ({ open, onOpenChange, booking, isCancelling, onCancel }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cancel Test Drive</DialogTitle>
        <DialogDescription>
          Are you sure you want to cancel your test drive for the{" "}
          {booking?.car
            ? `${booking.car.year} ${booking.car.make} ${booking.car.model}`
            : "vehicle"}
          ? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Date:</span>
          <span>
            {format(new Date(booking.bookingDate), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Time:</span>
          <span>
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </span>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isCancelling}
        >
          Keep Reservation
        </Button>
        <Button
          variant="destructive"
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            "Cancel Reservation"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Main Component
export function TestDriveCard({
  booking,
  onCancel,
  showActions = true,
  isPast = false,
  isAdmin = false,
  isCancelling = false,
  renderStatusSelector = () => null,
}) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancel = async () => {
    if (!onCancel) return;
    await onCancel(booking.id);
    setCancelDialogOpen(false);
  };

  const car = booking?.car;

  return (
    <>
      <Card
        className={`overflow-hidden ${
          isPast ? "opacity-80 hover:opacity-100 transition-opacity" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Car Image */}
          <div className="sm:w-1/4 relative h-40 sm:h-auto">
            {car?.images?.length > 0 ? (
              <Image
                src={car.images[0]}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Car className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="absolute top-2 right-2 sm:hidden">
              {getStatusBadge(booking.status)}
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-4 sm:w-1/2 sm:flex-1">
            <div className="hidden sm:block mb-2">
              {getStatusBadge(booking.status)}
            </div>

            <h3 className="text-lg font-bold mb-1">
              {car
                ? `${car.year} ${car.make} ${car.model}`
                : "Vehicle Info Unavailable"}
            </h3>

            {renderStatusSelector()}

            <div className="space-y-2 my-2 text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(booking.bookingDate), "EEEE, MMMM d, yyyy")}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </div>
              {isAdmin && booking.user && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {booking.user.name || booking.user.email}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="p-4 border-t sm:border-t-0 sm:border-l sm:w-1/4 sm:flex sm:flex-col sm:justify-center sm:items-center sm:space-y-2">
              {booking.notes && (
                <div className="bg-gray-50 p-2 rounded text-sm w-full">
                  <p className="font-medium">Notes:</p>
                  <p className="text-gray-600">{booking.notes}</p>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full my-2 sm:mb-0"
                asChild
              >
                <Link
                  href={`/cars/${booking.carId}`}
                  className="flex items-center justify-center"
                >
                  View Car
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {(booking.status === "PENDING" ||
                booking.status === "CONFIRMED") && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cancel"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Cancel Dialog */}
      {onCancel && (
        <CancelDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          booking={booking}
          isCancelling={isCancelling}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
