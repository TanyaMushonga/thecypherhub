import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useFetchSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscribers[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/subscribers", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSubscribers(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return { subscribers, loading, refetch: fetchSubscribers, setSubscribers };
};
